package com.papel.ui.profile;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.papel.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ProfileSubpageFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProfileSubpageFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfileSubpageFragment extends Fragment {

    public static final String ARG_SUBPAGE_NAME = "subpage_name";

    private String subpageName;

    private OnFragmentInteractionListener mListener;

    public ProfileSubpageFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param subpageName Name of subpage
     * @return A new instance of fragment ProfileSubpageFragment.
     */
    public static ProfileSubpageFragment newInstance(String subpageName) {
        ProfileSubpageFragment fragment = new ProfileSubpageFragment();
        Bundle args = new Bundle();
        args.putString(ARG_SUBPAGE_NAME, subpageName);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            subpageName = getArguments().getString(ARG_SUBPAGE_NAME);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_profile_subpage, container, false);
    }

    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
